export default {
    name: 'Lives',
    props: {
      lives: Number
    },
    template:
        `
            <div class="hearts">
                <span v-show="lives > 0" class="heart">&#9829;</span>
                <span v-show="lives > 1" class="heart">&#9829;</span>
                <span v-show="lives > 2" class="heart">&#9829;</span>
            </div>
        `
};
