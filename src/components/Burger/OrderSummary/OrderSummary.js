import React from 'react'

import Aux from '../../../hoc/Aux';
import Button from '../../UI/Button/Button'

const orderSummary = ( props ) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(igkey => {
            return <li key={igkey}>
                    <span style={{textTransform: 'capitalize'}}>{igkey}</span> :{props.ingredients[igkey]}
                 </li>
        })
    return (
    <Aux>
    <h3>Your Order</h3>
        <p>A delicious burger with the following ingredients:</p>
        <ul>
            {ingredientSummary}
        </ul>
        <p><strong>Total Price is: {props.price.toFixed(2)}</strong></p>
        <p>Continue to checkOut?</p>
        <Button btnType="Danger" clicked={props.cancelClicked}>CANCEL</Button>
        <Button btnType="Success" clicked={props.continueClicked}>CONTINUE</Button>
    </Aux>
    )

}


export default orderSummary;