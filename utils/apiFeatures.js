class ApiFeatures {
    constructor(dbQuery,reqQuery) {
      this.dbQuery = dbQuery;
      this.reqQuery = reqQuery;
      this.page = this.reqQuery.page * 1 || 1;
    }
    filter(){
       // basic filtirng
       const queryObj = { ...this.reqQuery };
       const excludedFields = ["page", "sort", "limit", "fields"];
       excludedFields.forEach((el) => delete queryObj[el]);
       // advanced filtring
       //ex ?price[gt]=100&price[lt]=150
       let queryStr = JSON.stringify(queryObj);
       queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
       console.log(queryStr);
   
       this.dbQuery=this.dbQuery.find(JSON.parse(queryStr));
       return this;
    }
    sort(){
      if (this.reqQuery.sort) {
        const sortBy = this.reqQuery.sort.split(",").join(" ");
        this.dbQuery = this.dbQuery.sort(sortBy);
      } else {
        this.dbQuery = this.dbQuery.sort("-createdAt _id");
      }
      return this;
    }
    limitFields(){
      if (this.reqQuery.fields) {
        const fields = this.reqQuery.fields.split(",").join(" ");
        this.dbQuery = this.dbQuery.select(fields);
      } else {
        //to remove the __v field
        this.dbQuery = this.dbQuery.select("-__v");
      }
      return this;
    }
    paginate(){
      
      const limit = this.reqQuery.limit * 1 || 5;
      const skip = (this.page - 1) * limit;
      this.dbQuery = this.dbQuery.skip(skip).limit(limit);
      
      return this;
    }
  }

  module.exports=ApiFeatures;