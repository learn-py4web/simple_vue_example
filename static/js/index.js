// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data that is kept in synch.
    app.data = {
        // Complete as you see fit.
        birds: [],
        new_bird_name: "",
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.inc_count = function (bird_idx, inc_amount) {
        // This increments the count.
        let b = app.vue.birds[bird_idx];
        b.count = Math.max(0, b.count + parseInt(inc_amount));
        // We tell the server the update.
        axios.post(my_post_url, b).then(function (response) {
            // We log the ok, simply for fun.
            console.log(response);
        })
    };

    app.create_bird = function () {
        // new_bird_name is the name of the new bird.
        // Before I can add the bird to the list, I need to send it
        // to the server to be inserted so that it gets an id.
        axios.post(add_bird_url, {bird_name: app.vue.new_bird_name}).then(
            function (response) {
                // I create a bird object that I can insert in the bird list.
                let b = {
                    id: response.data.bird_id,
                    name: app.vue.new_bird_name,
                    count: 0,
                }
                // I insert it at the top of the list of bird.
                app.vue.birds.unshift(b);
                // I have to re-create the _idx attribute.
                app.enumerate(app.vue.birds);
                // Clear the input field now that the bird is added.
                app.vue.new_bird_name = "";
            });

    }

    // This contains all the methods that tie HTML to JS.
    app.methods = {
        // Complete as you see fit.
        inc_count: app.inc_count,
        create_bird: app.create_bird,
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    // And this initializes it.
    app.init = () => {
        // Put here any initialization code.
        // Typically this is a server GET call to load the data.
        // Now we do an actual server call, using axios.
        axios.get(my_callback_url).then(function (response) {
            app.vue.birds = response.data.birds;
            app.enumerate(app.vue.birds);
        })
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
