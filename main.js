let eventBus = new Vue()

Vue.component('product', {

    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },

    template: `
        <div class="product">

            <div class="product-image">
                <img v-bind:src="image" alt="Socks">
            </div>

            <div class="product-info">

                <h1>{{ title }}</h1>
                <p v-if="inStock">In Stock</p>
                <p v-else 
                :class="{ outOfStock: !inStock }">Out of Stock</p>

                <p v-if="onSale">{{ sale }} </p>

                <ul>
                    <li v-for="detail in details">
                        {{ detail }}
                    </li>
                </ul>

                <p>User is premium: {{ premium }}</p>
                <p>Shipping: {{ shipping }} </p>

                <div v-for="(variant, index) in variants" 
                v-bind:key="variant.variantId"
                class="color-box"
                v-bind:style="{ backgroundColor: variant.variantColor }"
                v-on:mouseover="updateProduct(index)">

                </div>

        

                <div>
               
                    <button v-on:click="addToCart"
                    class="enabledButton"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">Add to Cart</button>

                    &nbsp;

                    <button style="display:inline-block" v-on:click="removeFromCart">Remove</button>

                </div>

            </div>

           

            <div class="product-image">

                <product-tabs :reviews="reviews"></product-tabs>

            </div>
            

    </div> `,

    data() {
        return {

            brand: 'Vue',
            product: 'Socks',
            textDecoration: 'line-through',
            description: 'A pair of socks',
            // image: './assets/img/vmSocks-green.jpg',
            selectedVariant: 0,
            // inStock: false,
            onSale: false,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [{
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: './assets/img/vmSocks-green.jpg',
                    variantQuantity: 100
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: './assets/img/vmSocks-blue.jpg',
                    variantQuantity: 0
                }
            ],
            reviews: []

        }

    },

    methods: {
        addToCart: function () {
            // this.cart += 1;
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },

        updateProduct: function (index) {

            // this.image = variantImage;
            this.selectedVariant = index;
            // console.log(index);

        },

        removeFromCart: function () {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        },

        // addReview(productReview) {
        //     this.reviews.push(productReview);
        // }
    },

    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' is on sale';
            }
            // return this.brand + ' ' + this.product + ' is one sale';
        },
        shipping() {
            if(this.premium) {
                return "Free"
            }
            return "2.77";
        }
       

    },
    
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        })
    }
})

Vue.component('product-review', {

    template: `

        <div>
            <form class="review-form" @submit.prevent="onSubmit">

                <p v-if="errors.length">
                    <b>Please correct the following error(s):</b>

                    <ul>
                        <li v-for="error in errors">{{ error }}</li>
                    </ul>
                    
                </p>


                <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name">
                </p>
            
                <p>
                <label for="review">Review:</label>      
                <textarea id="review" v-model="review"></textarea>
                </p>
            
                <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
                </p>

                <p>
                    Would you recommend this product?

                    <input type="radio" v-model="recommendation" value="Yes">Yes
                    <input type="radio" v-model="recommendation" value="No">No


                </p>
                
                <p>
                <input type="submit" value="Submit">  
                </p>    
        
        </form>
        </div>
    
    `,

    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommendation: null,
            errors: []
        }
       
    },

    methods: {
        onSubmit() {

            if(this.name && this.rating && this.review && this.recommendation) {

                let productReview = {
                    name : this.name,
                    review : this.review,
                    rating : this.rating,
                    recommendation: this.recommendation
                }
    
                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommendation = null;

            } else {
                if(!this.name) this.errors.push("Name is required")
                if(!this.rating) this.errors.push("Rating is required")
                if(!this.review) this.errors.push("Review is required")
                if(!this.recommendation) this.errors.push("Recommendation is required")
            }

        
        }
        
    },



})

Vue.component('product-tabs', {
    props:{ 
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div style="margin-left: 1rem">
            <span class="tab"
                :class="{ activeTab: selectedTab === tab}" 
                v-for="(tab,index) in tabs"
                :key="index"
                @click="selectedTab = tab">{{ tab }}
            </span>


            <br>

            <div v-show="selectedTab === 'Reviews'">

                <br>

                <p v-if="!reviews.length" style="margin-left: 1rem">There are no reviews yet</p>
                <ul>
                    <li v-for="review in reviews">

                        <p> {{ review.name }} </p>
                        <p> Rating: {{ review.rating }} </p>
                        <p> {{ review.review }} </p>

                    </li>
                </ul>
            
            </div>

            <product-review v-show="selectedTab === 'Make a Review'"
            ></product-review>
         </div>


    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart: function(id) {
            this.cart.push(id);
        },

        removeCart: function(id) {
            this.cart.pop(id);
        }
    }
})