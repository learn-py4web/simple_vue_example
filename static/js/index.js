// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        // Complete as you see fit.
        birds: [],
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

    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        inc_count: app.inc_count,
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
