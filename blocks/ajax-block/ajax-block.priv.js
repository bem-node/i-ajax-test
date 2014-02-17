/**
 * Created by slvrnight on 16.02.14.
 */
BEM.decl('ajax-block', null, {

    allowed: function (data) {
        var promise = Vow.promise();
        setTimeout(function () {
            promise.fulfill(data.num * 100);
        }, 100);
        return promise;
    },

    simple: function (data) {
        var promise = Vow.promise();
        setTimeout(function () {
            promise.fulfill(data.split('').reverse().join(''));
        }, 100);
        return promise;
    },

    denied: function () {
        var promise = Vow.promise();
        setTimeout(function () {
            promise.fulfill('Good');
        }, 100);
        return promise;
    }
});