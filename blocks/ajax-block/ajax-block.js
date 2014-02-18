/**
 * Created by slvrnight on 16.02.14.
 */
BEM.decl('ajax-block', null, {
    override: function (day) {
        return this._remoteCall('simple', this._prepareArgs([day + day]));
    }
});


// =========================================================================
// ==================================Tests==================================
// =========================================================================

setTimeout(function () {
    window._usedMethods = {};
    $.ajax = (function () {
        var ajax = $.ajax;
        return function (opt) {
            window._usedMethods[opt.type] = true;
            ajax.apply($, arguments);
        }
    }());

    console.assert(typeof BEM.blocks['ajax-block'].allowed === 'function', 'Remote method is not a function');
    console.assert(typeof BEM.blocks['ajax-block'].override === 'function', 'Custom remote method is not a function');
    console.assert(typeof BEM.blocks['ajax-block'].denied !== 'function', 'Disallowed function included in client code');

    console.assert(Vow.isPromise(BEM.blocks['ajax-block'].allowed({num: 1})), 'Returned value is not a promise');
    console.assert('get' in window._usedMethods, 'Method for small requests is not "get"');

    BEM.blocks['ajax-block'].simple('some text').then(function (res) {
        console.assert(res === 'some text'.split('').reverse().join(''), 'Answer for "simple" argument is incorrect');
    }).fail(function (err) {console.assert(false, err)});

    BEM.blocks['ajax-block'].override('some').then(function (res) {
        console.assert(res === 'somesome'.split('').reverse().join(''), 'Answer for "override" argument is incorrect');
    }).fail(function (err) {console.assert(false, err)});

    BEM.blocks['ajax-block'].allowed({num: 1}).then(function (res) {
        console.assert(res === 100, 'Answer for "allowed" argument is incorrect');
    }).fail(function (err) {console.assert(false, err)});

    BEM.blocks['ajax-block'].complex('complex').then(function (res) {
        console.assert(res.title === 'complex', 'Answer for "complex" argument is incorrect');
    }).fail(function (err) {console.assert(false, err)});

    BEM.blocks['ajax-block'].complex('00101001001010101010010001010101010100101001010101010010' +
            '01010010010101010100100010101010101001010010101010100100101001001010101010010001010' +
            '10101010010100101010101001001010010010101010100100010101010101001010010101010100100' +
            '10100100101010101001000101010101010010100101010101001001010010010101010100100010101' +
            '01010100101001010101010010010100100101010101001000101010101010010100101010101001001' +
            '01001001010101010010001010101010100101001010101010010010100100101010101001000101010' +
            '10101001010010101010100100101001001010101010010001010101010100101001010101010010010' +
            '10010010101010100100010101010101001010010101010100100101001001010101010010001010101' +
            '01010010100101010101001001010010010101010100100010101010101001010010101010100100101' +
            '00100101010101001000101010101010010100101010101001001010010010101010100100010101010' +
            '1010010100101010101001').then(function (res) {
    }).fail(function (err) {console.assert(false, err)});
    console.assert('post' in window._usedMethods, 'Method for large requests is not "post"');

    setTimeout(function () {
        BEM.blocks['ajax-block']._requestDebounce = true;

        BEM.blocks['ajax-block'].simple('first').then(function (res) {
            console.assert(res === 'first'.split('').reverse().join(''), 'Answer for first (simple) request in queue argument is incorrect');
        }).fail(function (err) {console.assert(false, err)});

        BEM.blocks['ajax-block'].allowed({num: 7}).then(function (res) {
            console.assert(res === 700, 'Answer for second (complex) request in queue argument is incorrect');
        }).fail(function (err) {console.assert(false, err)});

        BEM.blocks['ajax-block'].complex('complex').then(function (res) {
            console.assert(res.title === 'complex', 'Answer for "complex" argument is incorrect');
        }).fail(function (err) {console.assert(false, err)});

        console.assert(BEM.blocks['ajax-block']._requestQueue.length === 3, 'Request queue length is not equal 3');

        BEM.blocks['ajax-block']._requestDebounce = false;
    });
});