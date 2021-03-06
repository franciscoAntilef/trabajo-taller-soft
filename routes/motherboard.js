var router = require('express').Router();
const Gpu = require('../models/gpu');
const Cpu = require('../models/cpu');
const Motherboard = require('../models/motherboard');


/**
 *este metodo trae todas las motherboard que concuerden con un json query 
 */
router.get('/api/motherboard',(req,res,next)=>{
    var queryParameter = req.query;
    Motherboard.find(queryParameter,(err,motherboards)=>{
        if(err) return res.send({msj:"Error al realizar la peticion "});
        if(!motherboards) return res.send({msj:" no hay motherboard "});
        res.json(motherboards);
    })
})
router.get('/api/motherboard/:id',(req,res,next)=>{
    let id = req.params.id;
    Motherboard.findById(id,(err,motherboard)=>{
        if(err) return res.status(500).send({msj:"Error al realizar la peticion "});
        if(!motherboard) return res.status(404).send({msj:"la motherboard no existe "});
        res.json(motherboard);
    })
})

router.get('/api/motherboard/compatibilidadcpu/:id',(req,res,next)=>{
    let id = req.params.id;
    Motherboard.findById(id,(err,motherboard)=>{
        if(err) return res.status(500).send({msj:"Error al realizar la peticion "});
        if(!motherboard) return res.status(404).send({msj:"la motherboard no existe "});
        Cpu.find({socket:motherboard.socket},(err,cpus)=>{
            if(err) return res.status(200).send({msj:"Error en el servidor"});
            if(!cpus) return res.status(404).send({msj:"Error no hay cpu compatibles"})
            res.json(cpus);
        })        
    })
})
router.get('/api/motherboard/compatibilidadgpu/:id',(req,res,next)=>{
    let id = req.params.id;
    Motherboard.findById(id,(err,motherboard)=>{
        if(err) return res.status(500).send({msj:"Error al realizar la peticion "});
        if(!motherboard) return res.status(404).send({msj:"la motherboard no existe "});
        Gpu.find({puerto:motherboard.puerto},(err,gpus)=>{
            if(err) return res.status(200).send({msj:"Error en el servidor"});
            if(!gpus) return res.status(404).send({msj:"Error no hay gpu compatibles"}) 
            res.json(gpus);
        })        
    })
})


router.post('/api/motherboard',(req,res,next)=>{
    console.log(req.body);
    let motherboard = new Motherboard();
    motherboard.name = req.body.name;
    motherboard.socket = req.body.socket;
    motherboard.category = req.body.category;
    motherboard.chipset = req.body.chipset;
    motherboard.img = req.body.img;
    motherboard.puerto = req.body.puerto;
    motherboard.fab = req.body.fab;
    motherboard.format = req.body.format;

    motherboard.save((err,motherboardStore)=>{
        if(err) res.status(500).send({msj:`Error to save ${err}` })
        res.status(200).send({product:motherboardStore});
    })
})
router.put('/api/motherboard/:id',(req,res,next)=>{
    let id = req.params.id;
    let update = req.body;
    Motherboard.findByIdAndUpdate(id,update,(err,motherboardUpdate)=>{
        if(err) res.status(500).send({msj:'Erro al conectar con el servidor'})
        res.status(200).send({motherboard:motherboardUpdate});
    })
})
router.delete('/api/motherboard/:id',(req,res,next)=>{
    let id = req.params.id;
    Motherboard.findById(id,(err,motherboard)=>{
        if(err) res.status(500).send({msj:'Erro al conectar con el servidor'})
        motherboard.remove(err=>{
            if(err) res.status(500).send({msj:"Error del servidor"});
            res.status(200).send({msj:'motherboard borrada'})
        })
    })
})
module.exports = router;