'use_strict'

var DbService= require('./lib/DbService')



/**
 * awsm-architect-db
 */
module.exports= function setup(options, imports, register) {

    console.assert(options.config, "Option 'config' is required")



    var $config= imports.$config

    var cfg= $config.create(options.config)



    var $db= new DbService(cfg.get('sql'))



    register(null, {
        $db: $db,
    })

}
