var PRICE = 9.99;
var LOAD_NUM = 10;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        results: [],
        cart: [],
        newSearch: 'Anime',
        lastSearch: '',
        loading: false,
        prise: PRICE
    },
    computed: {
        noMoreItems: function () {
            return this.items.length === this.results.length  && this.results.length > 0;
        }
    },
    methods: {
        appendItems: function(){
            //console.log('appendItems');
            if(this.items.length < this.results.length){
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }
        },
        onSubmit: function () {
            //            console.log(this.$http);
            if(this.newSearch.length){
                this.loading = true;
                this.items = [];
                this.$http
                    .get('/search/'.concat(this.newSearch))
                    .then(function (res) {
                        //console.log(res.data);
                        this.lastSearch = this.newSearch;
                        this.results = res.data;
                        this.appendItems();
                        //this.items = res.data.slice(0, LOAD_NUM);
                        this.loading = false;
                    });
            }
        },
        addItem: function(index){
            this.total += PRICE;
            console.log(index);
            var item = this.items[index];
            var found = false;
            for(var i=0; i < this.cart.length; i++){
                if(this.cart[i].id === item.id){
                    found = true;
                    this.cart[i].qty++;
                    break;
                }
            }
            if(!found){
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    prise: PRICE
                })
            }
        },
        inc: function (item) {
            item.qty++;
            this.total += PRICE;
        },
        dec: function (item) {
            item.qty--;
            this.total -= PRICE;
            if(item.qty <= 0){
                for( var i = 0; i<this.cart.length; i++){
                    this.cart.splice(i, 1);
                    break;
                }
            }
        }
    },
    filters: {
        currency: function(price){
            return '$'.concat(price);
        }
    },
    mounted: function () {
        this.onSubmit();

        var vueInstance= this;
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function () {
            vueInstance.appendItems();
            console.log("Entered viewport");
        });

    }
});

