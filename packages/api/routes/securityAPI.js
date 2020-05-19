let security = function(req, res, next){
    console.log("Thực hiện công việc bảo mật API tại đây");

    // writing code

    next();
};
module.exports = {security}