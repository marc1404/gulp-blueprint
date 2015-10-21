module.exports = app => {
/* inject */
    function register(module){
        if(module.controller){
            return app.controller(module.name, module.controller);
        }

        if(module.directive){
            return app.directive(module.name, module.directive);
        }

        if(module.service){
            return app.factory(module.name, module.service);
        }
    }
};