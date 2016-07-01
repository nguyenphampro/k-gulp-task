Class HelloWorld {
    constructor(public Hello: string) { }
    greet() {
        return this.Hello;
    }
};

var greeter = new HelloWorld("This is Hello World by TypeScript");
    
document.body.innerHTML = greeter.greet();