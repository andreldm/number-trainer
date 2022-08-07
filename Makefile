CC=gcc
CFLAGS=-O2 -Wall -Wextra $(shell pkg-config --cflags gtk4)
LDFLAGS=$(shell pkg-config --libs gtk4)
PREFIX=/usr

trainer: main.c
	$(CC) $(CFLAGS) main.c -o number-trainer $(LDFLAGS)

clean:
	rm -f number-trainer

.PHONY: clean install
