import  React, { Component } from 'react'

import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders'

const INGREDIENT_PRICES = {
    salad: 10,
    bacon: 5,
    cheese: 20,
    meat: 25
}


class BurgerBuilder extends Component {
    state = {
        ingredients :null,
        totalPrice: 40,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-bb-app.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data})
            }).catch(err => {
                this.setState({error: true})
            })
    }

    updatepurchasable(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            }).reduce((sum, el) => {
                return sum+el
            }, 0)

        this.setState({purchasable: sum>0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1 ;
        const updatedIngredients  = {
            ...this.state.ingredients
        }
        updatedIngredients[type]  = updatedCount
        const priceAddition  = INGREDIENT_PRICES[type];
        const oldPrice  = this.state.totalPrice;
        const updatedPrice = oldPrice + priceAddition;

        this.setState({ingredients: updatedIngredients, totalPrice: updatedPrice})
        this.updatepurchasable(updatedIngredients);
    }


    removeIngredientHandler =(type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1 ;
        const updatedIngredients  = {
            ...this.state.ingredients
        }
        updatedIngredients[type]  = updatedCount
        const priceAddition  = INGREDIENT_PRICES[type];
        const oldPrice  = this.state.totalPrice;
        const updatedPrice = oldPrice - priceAddition;

        this.setState({ingredients: updatedIngredients, totalPrice: updatedPrice})
        this.updatepurchasable(updatedIngredients);
    }

    updatePurhasehandler = () => {
        this.setState({purchasing: true})
    }

    cancelPurchaseHandler = () => {
        this.setState({purchasing: false})
    }

    continuePurchaseHandler = () => {
        this.setState({loading: true})
        const order = {
                ingredients: this.state.ingredients,
                price: this.state.totalPrice,
                customer : {
                    name: 'vishwanath visu',
                    address: 'Hyderabad',
                    street: 'Saidabad',
                    Country: 'India'
                },
                email: 'test123@gmail.com',
                deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order).then(response => {
            this.setState({loading: false, purchasing: false})
        }).catch(error => {
            this.setState({loading: false, purchasing: false})
        })
    }

    render() {
        const disableInfo = {
            ...this.state.ingredients
        }

        for(let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0
        }
        let orderSummary = null;
      

        let burger = this.state.error ? <p style={{textAlign:'center'}}>Ingredient's cant'be loaded</p> : <Spinner />

        if(this.state.ingredients) {
            burger = (
                <Aux>
                <Burger ingredients={this.state.ingredients} />
            <BuildControls
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler}
                disabled={disableInfo}
                price={this.state.totalPrice}
                purchasable={this.state.purchasable}
                ordered={this.updatePurhasehandler} />
                </Aux>
            )
            orderSummary = <OrderSummary ingredients={this.state.ingredients}
            cancelClicked={this.cancelPurchaseHandler}
            continueClicked={this.continuePurchaseHandler}
            price={this.state.totalPrice} />
        }
        if (this.state.loading) {
            orderSummary = <Spinner />
        }

    return (
      <Aux>
          <Modal show={this.state.purchasing} modalClosed={this.cancelPurchaseHandler}>
              {orderSummary}
            </Modal>
                {burger}
      </Aux>
    )
  }
}

export default withErrorHandler(BurgerBuilder, axios);