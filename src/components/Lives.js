export default {
    name: 'Lives',
    props: {
      lives: Number
    },
    template:
        `
            <div class="hearts">
                <span v-show="lives > 0" class="heart"></span>
                <span v-show="lives > 1" class="heart"></span>
                <span v-show="lives > 2" class="heart"></span>
            </div>
        `
};
