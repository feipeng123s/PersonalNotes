require.config({
    baseUrl: ".",
    paths: {
        "jquery": "lib/jquery-3.3.1.min",
        // 'css': 'lib/css.min'
    },
    map: {
        '*': {
          'css': 'lib/css.min'
        }
    }
});

// require(["css!./style/main.css"]);

require(["one", "three"], function (one, three) {
    console.log(one + three);
});