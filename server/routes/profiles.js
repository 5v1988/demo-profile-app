import express from "express";
import db from '../db/conn.js'
const COLLECTION_NAME = 'profiles'
const router = express.Router();

router.get('/all', async (req, res) => {
    let collection = db.collection(COLLECTION_NAME);
    let queryString = {}
    if (req.query.name != null)
        queryString.name = req.query.name
    if (req.query.gender != null)
        queryString.gender = req.query.gender
    if (req.query.age != null){
        let age = Number(req.query.age);
        queryString.age = age;
    }  
    console.log(queryString)
    let results = await collection.find(queryString).toArray();
    return res.send(Object.values(results))
        .status(200);
});

router.get('/:id', async (req, res) => {
    let result;
    let collection = db.collection(COLLECTION_NAME);
    let documentId = Number(req.params['id']);
    let count = await collection.countDocuments({id: documentId});
    if(count < 1)
        return res.status(404).send({'message' : 'Not found'});
    result = await collection.findOne({ id: documentId });
    return res.send(result).status(200);
});

router.post('/create', async (req, res) => {
    let collection = db.collection(COLLECTION_NAME);
    let count = await collection.countDocuments();
    let document = req.body;
    document.id = ++count;
    await collection.insertOne(document);
    return res.status(201).send({ message: 'Profile is added', id:  count});
});

router.put('/update/:id', async (req, res) => {
    let collection = db.collection(COLLECTION_NAME);
    let documentId = Number(req.params['id']);
    let count = await collection.countDocuments({id: documentId});
    if (count < 1)
        return res.status(404).send({'message': 'Not found'});
    let newDocument = req.body;
    await collection.updateOne({ id: documentId }, { $set: newDocument });
    let result = await collection.findOne({ id: documentId });
    return res.send(result).status(200);
});

router.delete('/delete/:id', async (req, res) => {
    let collection = db.collection(COLLECTION_NAME);
    let documentId = Number(req.params['id']);
    let count = await collection.countDocuments({id: documentId});
    if (count < 1)
        return res.status(404).send({'message': 'Not found'});
    await collection.deleteOne({ id: documentId });
    return res.status(200).send({'message': `Profile is deleted`, id: documentId});
});

export default router;

