export default class UserReqDto {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role || "user";
        this.cart = user.cart;
        this.password = user.password;
        this.fromGoogle = user.fromGoogle || false;
        this.resetToken = user.resetToken;
        this.resetTokenExpiry = user.resetTokenExpiry;
        this.isVerified = user.isVerified;
        this.verificationToken = user.verificationToken;
        this.verificationTokenExpiry = user.verificationTokenExpiry;
    };
};