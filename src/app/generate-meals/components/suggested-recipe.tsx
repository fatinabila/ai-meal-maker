export default function SuggestedRecipe() {

    return (
        <div className="mx-4">

            <h4>Or try our suggested recipe of the day</h4>
            <div className="card w-100" style={{width: "18rem"}}>
                <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170" className="card-img-top" alt="..."/>
                <div className="card-body">
                <h5 className="card-title">Suggested recipe for you</h5>
                <p className="card-text">Some quick example text to build on the card title and
                    make up the bulk of the card’s content.</p>
                </div>
            </div>

           
        </div>

    )

}