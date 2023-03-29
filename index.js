const express=require("express");
const app=express();

const port=3000;

const db = [
    {
        name:"afif",
        role:"students",
        age:19
    },
    {
        name:"habibi",
        role:"BE",
        age:20
    }
];

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ data:db });
});

app.post('/', (req, res) => {
    const { name, origin, role }=req.body;
    if(!name || !origin || !role)
        res.status(400).json({message: "Name, origin, and role must be filled"});
    db.push({name, origin, role});
    res.status(201).json({ data:db });
});

app.listen(port, () => console.log('Server listening on port ${port}'));
