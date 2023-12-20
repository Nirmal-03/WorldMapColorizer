import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app=express();
const port=4000;

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"))

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"world",
    password:"niranjan",
    port:5432
});
db.connect();

let countries=[];
app.get("/",async(req,res)=>{
    let result=await db.query("SELECT * FROM visited_country")
    result.rows.forEach((country)=>{
        countries.push(country.country_code);
    })
    res.render("page",{
        countrys:countries,
        total:countries.length
    })
})

app.post("/submit",async(req,res)=>{
    let country=req.body.countryname;
    let codes=await db.query("SELECT country_code FROM countries WHERE country_name=$1",[country]);
    if(codes.rows.lenght!==0){
        let codeof=codes.rows[0];
        let codescoun=codeof.country_code;
        db.query("INSERT INTO visited_country (country_code) VALUES ($1)",[codescoun]);
        res.redirect("/");
    }
})

app.listen(port,()=>{
    console.log(`the server is running on port ${port}.`)
})

