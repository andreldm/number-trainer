#include <gtk/gtk.h>

// TODO combobox in start screen
const gchar *LANG = "de-DE";
// const gchar *LANG = "en-US";

typedef struct {
  GtkWidget *window;
  GtkWidget *counter;
  GtkWidget *image1, *image2, *image3;
  GtkWidget *button;
  GtkWidget *progress;
  GtkWidget *entry;
  gchar     *number;
  guint      tick_event_source;
  gint       mistakes;
  gint       correct_answers;
} Data;



static gboolean play (gpointer user_data);



static void
show_error (GtkWidget *window,
            gchar     *message)
{
  GtkWidget *dialog;

  dialog = gtk_message_dialog_new (GTK_WINDOW (window),
                                   GTK_DIALOG_DESTROY_WITH_PARENT | GTK_DIALOG_MODAL,
                                   GTK_MESSAGE_ERROR,
                                   GTK_BUTTONS_CLOSE,
                                   message);
  gtk_window_set_title (GTK_WINDOW (dialog), "Error");
  g_signal_connect (dialog, "response", G_CALLBACK (gtk_window_destroy), NULL);
  gtk_widget_show (dialog);
}



static void
reset (Data *data, gboolean mistake)
{
  data->tick_event_source = 0;
  gtk_widget_set_sensitive (data->button, TRUE);
  gtk_widget_grab_focus (data->button);
  gtk_widget_set_sensitive (data->entry, FALSE);
  gtk_editable_set_text (GTK_EDITABLE (data->entry), "");
  gtk_progress_bar_set_fraction (GTK_PROGRESS_BAR (data->progress), 1.0);

  if (mistake)
  {
    data->mistakes++;
    if (data->mistakes == 1) gtk_image_set_from_icon_name (GTK_IMAGE (data->image1), "non-starred");
    else if (data->mistakes == 2) gtk_image_set_from_icon_name (GTK_IMAGE (data->image2), "non-starred");
    else if (data->mistakes == 3)
    {
      // game over
      gtk_image_set_from_icon_name (GTK_IMAGE (data->image3), "non-starred");
      gtk_widget_set_sensitive (data->button, FALSE);
      // TODO show game over screen
    }
  }
}



static void
check (gpointer user_data)
{
  Data *data;
  gboolean mistake;

  data = user_data;
  mistake = g_strcmp0 (data->number, gtk_editable_get_text (GTK_EDITABLE (data->entry))) != 0;
  g_source_remove (data->tick_event_source);
  reset (data, mistake);
  gtk_widget_set_sensitive (data->button, FALSE);

  if (data->mistakes < 3)
  {
    g_timeout_add_seconds (mistake ? 2 : 1, play, data);
  }

  if (!mistake)
  {
    gchar *text;
    text = g_strdup_printf ("%d", ++data->correct_answers);
    gtk_label_set_text (GTK_LABEL (data->counter), text);
    g_free (text);
  }
}



static gboolean
tick (gpointer user_data)
{
  Data *data;
  gdouble fraction;

  data = user_data;
  fraction = gtk_progress_bar_get_fraction (GTK_PROGRESS_BAR (data->progress)) - ((3.0 / 10) / (1000 / 50));

  if (fraction > 0)
  {
    gtk_progress_bar_set_fraction (GTK_PROGRESS_BAR (data->progress), fraction);
    return TRUE;
  }

  reset (data, TRUE);

  return FALSE;
}



static gboolean
play (gpointer user_data)
{
  Data *data;
  GBytes *buf, *out;
  GSubprocess *proc;
  GError *error;

  data = user_data;
  error = NULL;
  out = NULL;

  gtk_widget_set_sensitive (data->button, FALSE);
 
  proc = g_subprocess_new (G_SUBPROCESS_FLAGS_STDIN_PIPE | G_SUBPROCESS_FLAGS_STDOUT_PIPE, &error, "pico-tts", "-l", LANG, NULL);
  if (G_UNLIKELY (!proc))
  {
    show_error (data->window, error->message);
    g_error_free (error);
    gtk_widget_set_sensitive (data->button, TRUE);
    return FALSE;
  }

  data->number = g_strdup_printf ("%d", g_random_int_range (0, 1000));
  // TODO: remove
  g_print("%s\n", data->number);
  buf = g_bytes_new (data->number, strlen (data->number));

  g_subprocess_communicate (proc, buf, NULL, &out, NULL, &error);
  g_object_unref (G_OBJECT (proc));
  g_bytes_unref (buf);

  if (G_UNLIKELY (error))
  {
    show_error (data->window, error->message);
    g_error_free (error);
    g_bytes_unref (out);
    gtk_widget_set_sensitive (data->button, TRUE);
    return FALSE;
  }

  proc = g_subprocess_new (G_SUBPROCESS_FLAGS_STDIN_PIPE | G_SUBPROCESS_FLAGS_STDERR_SILENCE, &error, "aplay", "--rate=16000", "--channels=1", "--format=S16_LE", NULL);
  if (G_UNLIKELY (!proc))
  {
    show_error (data->window, error->message);
    g_error_free (error);
    g_bytes_unref (out);
    gtk_widget_set_sensitive (data->button, TRUE);
    return FALSE;
  }

  g_subprocess_communicate (proc, out, NULL, NULL, NULL, &error);
  g_object_unref (G_OBJECT (proc));
  g_bytes_unref (out);

  if (G_UNLIKELY (error))
  {
    show_error (data->window, error->message);
    g_error_free (error);
    gtk_widget_set_sensitive (data->button, TRUE);
    return FALSE;
  }

  gtk_widget_set_sensitive (data->entry, TRUE);
  gtk_widget_grab_focus (data->entry);
  data->tick_event_source = g_timeout_add (50, tick, data);

    return FALSE;
}



static void
activate (GtkApplication *app)
{
  Data *data;
  GtkWidget *window, *grid, *image_box, *vbox;
  GtkWidget *counter, *image, *button, *progress, *entry;
  PangoAttrList *attrs;
  PangoFontDescription *font_desc;
  PangoAttribute *attr;

  data = g_new0 (Data, 1);
  data->mistakes = 0;
  data->correct_answers = 0;
 
  data->window = window = gtk_application_window_new (app);
  gtk_window_set_title (GTK_WINDOW (window), "Number Trainer");
  gtk_window_set_default_size (GTK_WINDOW (window), 320, 240);
  gtk_window_set_resizable (GTK_WINDOW (window), FALSE);
  gtk_window_set_icon_name (GTK_WINDOW (window), "format-text-bold");

  grid = gtk_grid_new ();
  gtk_widget_set_margin_top (grid, 8);
  gtk_widget_set_margin_bottom (grid, 8);
  gtk_widget_set_margin_start (grid, 8);
  gtk_widget_set_margin_end (grid, 8);
  gtk_widget_set_hexpand (grid, TRUE);
  gtk_widget_set_vexpand (grid, TRUE);
  gtk_window_set_child (GTK_WINDOW (window), grid);

  attrs = pango_attr_list_new ();
  font_desc = pango_font_description_new ();
  pango_font_description_set_size (font_desc, 22 * PANGO_SCALE);
  attr = pango_attr_font_desc_new (font_desc);
  pango_attr_list_insert (attrs, attr);

  data->counter = counter = gtk_label_new ("0");
  gtk_widget_set_hexpand (counter, TRUE);
  gtk_widget_set_halign (counter, GTK_ALIGN_START);
  gtk_label_set_attributes (GTK_LABEL (counter), attrs);
  pango_font_description_free (font_desc);
  pango_attr_list_unref (attrs);
  gtk_grid_attach (GTK_GRID (grid), counter, 0, 0, 1, 1);

  image_box = gtk_box_new (GTK_ORIENTATION_HORIZONTAL, 8);
  gtk_widget_set_hexpand (image_box, TRUE);
  gtk_widget_set_halign (image_box, GTK_ALIGN_END);
  gtk_grid_attach (GTK_GRID (grid), image_box, 1, 0, 1, 1);

  data->image1 = image = gtk_image_new_from_icon_name ("starred");
  gtk_image_set_icon_size (GTK_IMAGE (image), GTK_ICON_SIZE_LARGE);
  gtk_box_append (GTK_BOX (image_box), image);
  data->image2 = image = gtk_image_new_from_icon_name ("starred");
  gtk_image_set_icon_size (GTK_IMAGE (image), GTK_ICON_SIZE_LARGE);
  gtk_box_append (GTK_BOX (image_box), image);
  data->image3 = image = gtk_image_new_from_icon_name ("starred");
  gtk_image_set_icon_size (GTK_IMAGE (image), GTK_ICON_SIZE_LARGE);
  gtk_box_append (GTK_BOX (image_box), image);

  vbox = gtk_box_new (GTK_ORIENTATION_VERTICAL, 8);
  gtk_widget_set_halign (vbox, GTK_ALIGN_CENTER);
  gtk_widget_set_valign (vbox, GTK_ALIGN_CENTER);
  gtk_widget_set_margin_top (vbox, 48);
  gtk_grid_attach (GTK_GRID (grid), vbox, 0, 1, 2, 1);

  data->button = button = gtk_button_new_with_label ("Play");
  g_signal_connect_swapped (button, "clicked", G_CALLBACK (play), data);
  gtk_box_append (GTK_BOX (vbox), button);

  data->progress = progress = gtk_progress_bar_new ();
  gtk_progress_bar_set_fraction (GTK_PROGRESS_BAR (progress), 1.0);
  gtk_box_append (GTK_BOX (vbox), progress);

  data->entry = entry = gtk_entry_new ();
  gtk_widget_set_sensitive (entry, FALSE);
  g_signal_connect_swapped (entry, "activate", G_CALLBACK (check), data);
  gtk_box_append (GTK_BOX (vbox), entry);

  gtk_widget_show (window);
}



int
main (int    argc,
      char **argv)
{
  GtkApplication *app;
  int status;

  app = gtk_application_new ("com.andreldm.number-trainer", G_APPLICATION_FLAGS_NONE);
  g_signal_connect (app, "activate", G_CALLBACK (activate), NULL);
  status = g_application_run (G_APPLICATION (app), argc, argv);
  g_object_unref (app);

  return status;
}
