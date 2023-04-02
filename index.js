/* Yang Belum:
    - menyesuaikan status
    - menyesuaikan error response dengan format
    - error tipe data tidak sesuai
    - update tidak perlu semua field
*/
const express=require("express");
const app=express();

const port=3000;

const identity = {
    name:"afif",
    role:"students",
    age:19
};

const bookdb=[
    {
        id:1,
        judul:"The Demon Haunted World",
        kategori:"Sains",
        harga:110000,
        tersedia:true
    },
    {
        id:2,
        judul:"Laut Bercerita",
        kategori:"Novel",
        harga:100000,
        teredia:true
    },
    {
        id:3,
        judul:"Max Havelaar",
        kategori:"Sastra",
        harga:80000,
        tersedia:false
    },
    {
        id:4,
        judul:"Zero to One",
        kategori:"Bisnis",
        harga:88000,
        tersedia:true
    },
    {
        id:5,
        judul:"Filsafat Ilmu Pengetahuan",
        kategori:"Filsafat",
        harga:120000,
        tersedia:false
    },
    {
        id:6,
        judul:"Detektif Conan : Dimensional Sniper 2",
        kategori:"Komik",
        harga:21750,
        tersedia:true
    }
];

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ data:identity });
});

//get books data
app.get('/buku', (req, res) => {
    res.status(200).json({ data:bookdb });
});

//get book data by id
app.get('/buku/:id', (req, res) => {
    const id=req.params.id;

    const book=bookdb.find(book => book.id==id);

    // error : id buku tidak ada
    if(!book){
        return res.status(404).json({message:`Buku dengan id ${id} tidak ditemukan`});
    }

    // success dengan pengembalian data buku
    res.status(200).json({ data:book });
});

//Create New Book
app.post('/', (req, res) => {
    const { id,judul,kategori,harga,tersedia }=req.body;
    
    // error: data tidak lengkap
    if(!id || !judul || !kategori || !harga || tersedia==undefined)
        return res.status(400).json({message: "id, judul, kategori, harga, dan tersedia harus diisi"});

    //id tidak boleh sama
    const book=bookdb.find(book => book.id==id);
    if(book)
        return res.status(400).json({message: `Terdapat buku dengan id ${id}, gunakan id lain`});

    bookdb.push({id,judul,kategori,harga,tersedia});

    // success dengan pengembalian data
    res.status(201).json({ data:bookdb });
});

//update data by id
app.put('/buku/:id', (req, res) => {
    const id=req.params.id;
    const {judul,kategori,harga,tersedia}=req.body;

    const book=bookdb.find(book => book.id==id);

    //error: id buku tidak ada
    if(!book)
        return res.status(400).json({message:`Buku dengan id ${id} tidak ditemukan`});

    book.judul=judul;
    book.kategori=kategori;
    book.harga=harga;
    book.tersedia=tersedia;

    // success dengan pengembalian data
    res.status(201).json({data:bookdb});
});

//delete book data by id
app.delete('/buku/:id', (req,res) => {
    const id=req.params.id;

    const book=bookdb.find(book => book.id==id);

    // error : buku tidak ditemukan
    if(!book)
        return res.status(400).json({message:`Buku dengan id ${id} tidak ditemukan`});

    const bookIndex=bookdb.indexOf(book);
    bookdb.splice(bookIndex,1);

    // succes dengan message
    res.status(201).json({
        message:`Buku dengan id ${id} berhasil dihapus`
    });
});

app.listen(port, () => console.log('Server listening on port ${port}'));
