class Features{
    constructor(query,queryStr){
        this.query=query
        this.queryStr=queryStr
    }
   
    search(){
        const word=this.queryStr.word?{
            name:{
                $regex:this.queryStr.word,
                $options:"i",
            }

        }:{

        }
        console.log(word)
        this.query=this.query.find({...word})
        return this
    }
    filter(){
        
    }

}

module.exports=Features