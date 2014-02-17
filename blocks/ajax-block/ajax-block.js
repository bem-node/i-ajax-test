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
    console.assert(typeof BEM.blocks['ajax-block'].allowed === 'function', 'Remote method is not a function');
    console.assert(typeof BEM.blocks['ajax-block'].override === 'function', 'Custom remote method is not a function');
    console.assert(typeof BEM.blocks['ajax-block'].denied !== 'function', 'Disallowed function included in client code');

    console.assert(Vow.isPromise(BEM.blocks['ajax-block'].allowed({num: 1})), 'Returned value is not a promise');

    BEM.blocks['ajax-block'].simple('some text').then(function (res) {
        console.assert(res === 'some text'.split('').reverse().join(''), 'Answer for "simple" argument is incorrect')
    }).fail(function (err) {console.assert(false, err)});

    BEM.blocks['ajax-block'].override('some').then(function (res) {
        console.assert(res === 'somesome'.split('').reverse().join(''), 'Answer for "override" argument is incorrect')
    }).fail(function (err) {console.assert(false, err)});

    BEM.blocks['ajax-block'].allowed({num: 1}).then(function (res) {
        console.assert(res === 100, 'Answer for "allowed" argument is incorrect')
    }).fail(function (err) {console.assert(false, err)});

    setTimeout(function () {
        BEM.blocks['ajax-block']._requestDebounce = true;

        BEM.blocks['ajax-block'].simple('first').then(function (res) {
            console.assert(res === 'first'.split('').reverse().join(''), 'Answer for first (simple) request in queue argument is incorrect');
        }).fail(function (err) {console.assert(false, err)});

        BEM.blocks['ajax-block'].allowed({num: 7}).then(function (res) {
            console.assert(res === 700, 'Answer for second (complex) request in queue argument is incorrect');
        }).fail(function (err) {console.assert(false, err)});

        console.assert(BEM.blocks['ajax-block']._requestQueue.length === 2, 'Request queue length is not equal 2');

        BEM.blocks['ajax-block']._requestDebounce = false;
    });
});