class HomeController{

    async index(req, res){
        res.send("API Rest! - API BY GLAUDISTON NETO");
    }

}

module.exports = new HomeController();