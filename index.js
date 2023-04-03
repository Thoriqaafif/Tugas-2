/* Yang Belum:
    - menyesuaikan status
    - menyesuaikan error response dengan format
    - error tipe data tidak sesuai
    - update tidak perlu semua field
    - 1 url 1 endpoint
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
    errors=[];
    errorId=[];

    const book=bookdb.find(book => book.id==id);

    // error : id buku tidak ada
    if(!book){
        errorId.push(`Tidak terdapat buku dengan id ${id}`);
        errors.push({"id":errorId})
        return res.status(404).json({"errors":errors});
    }

    // success dengan pengembalian data buku
    res.status(200).json({ data:book });
});

//Create New Book
app.post('/buku/post', (req, res) => {
    const { id,judul,kategori,harga,tersedia }=req.body;
    error=[];
    errorId=[];
    errorJudul=[];
    errorKategori=[];
    errorHarga=[];
    errorTersedia=[];
    const book=bookdb.find(book => book.id==id);
    
    //id tidak dimasukkan
    if(typeof id=="undefined")
        errorId.push("id harus diisi");
    //id duplikat
    if(book)
        errorId.push(`Terdapat buku lain dengan id ${id}, gunakan id lain`);
    //id bukan angka
    if(typeof id != "number")
        errorId.push("id harus berupa bilangan");
    if(errorId.length!=0)
        error.push({"id": errorId});
    
    //judul tidak dimasukkan
    if(typeof judul=="undefined")
        errorJudul.push("judul harus diisi");
    //judul bukan string
    if(typeof judul != "string")
        errorJudul.push("judul harus berupa string");
    if(errorJudul.length!=0)
        error.push({"judul": errorJudul});

    //kategori tidak dimasukkan
    if(typeof kategori=="undefined")
        errorKategori.push("kategori harus diisi");
    //kategori bukan berupa string
    if(typeof kategori != "string")
        errorKategori.push("kategori harus berupa string");
    if(errorKategori.length!=0)
        error.push({"kategori": errorKategori});

    //harga tidak dimasukkan
    if(typeof harga=="undefined")
        errorHarga.push("harga harus diisi");
    if(typeof harga != "number")
        errorHarga.push("harga harus berupa bilangan");
    if(errorHarga.length!=0)
        error.push({"harga": errorHarga});

    //tersedia tidak diisi
    if(typeof tersedia=="undefined")
        errorTersedia.push("tersedia harus diisi");
    if(typeof tersedia != "bool")
        errorTersedia.push("tersedia harus berupa boolean");
    if(errorTersedia.length!=0)
        error.push({"tersedia": errorTersedia});

    if(error.length!=0)
        return res.status(400).json({"errors":error});

    bookdb.push({id,judul,kategori,harga,tersedia});

    // success dengan pengembalian data
    res.status(200).json({ data:bookdb });
});

//update data by id
app.put('/buku/put/:id', (req, res) => {
    const id=req.params.id;
    const {judul,kategori,harga,tersedia}=req.body;
    error=[];
    errorJudul=[];
    errorKategori=[];
    errorHarga=[];
    errorTersedia=[];

    const book=bookdb.find(book => book.id==id);

    //error: id buku tidak ada
    if(!book){
        error.push({"id":`Buku dengan id ${id} tidak ditemukan`})
        return res.status(404).json({"errors":error});
    }

    //judul bukan string
    if(typeof judul != "string" && typeof judul!="undefined"){
        errorJudul.push("judul harus berupa string");
        error.push({"judul": errorJudul});
    }

    //kategori bukan berupa string
    if(typeof kategori != "string" && typeof kategori!="undefined"){
        errorKategori.push("kategori harus berupa string");
        error.push({"kategori": errorKategori});
    }

    //harga bukan number
    if(typeof harga != "number" && typeof harga!="undefined"){
        errorHarga.push("harga harus berupa bilangan");
        error.push({"harga": errorHarga});
    }

    //tersedia bukan boolean
    if(typeof tersedia != "bool" && typeof tersedia!="undefined"){
        errorTersedia.push("tersedia harus berupa boolean");
        error.push({"tersedia": errorTersedia});
    }

    //terdapat error input
    if(error.length > 0){
        return res.status(400).json({"errors":error});
    }

    if(typeof judul!="undefined")
        book.judul=judul;
    if(typeof kategori!="undefined")
        book.kategori=kategori;
    if(typeof harga!="undefined")
        book.harga=harga;
    if(typeof tersedia!="undefined")
        book.tersedia=tersedia;

    // success dengan pengembalian data
    res.status(200).json({data:book});
});

//delete book data by id
app.delete('/buku/del/:id', (req,res) => {
    const id=req.params.id;

    const book=bookdb.find(book => book.id==id);

    // error : buku tidak ditemukan
    if(!book)
        return res.status(404).json({message:`Buku dengan id ${id} tidak ditemukan`});

    const bookIndex=bookdb.indexOf(book);
    bookdb.splice(bookIndex,1);

    // success dengan message
    res.status(200).json({
        message:`Buku dengan id ${id} berhasil dihapus`
    });
});

app.listen(port, () => console.log('Server listening on port ${port}'));
