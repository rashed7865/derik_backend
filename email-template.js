const Template = (
    {
        orderId, name, orderStatus, link
    }) => {
    return `
    <!DOCTYPE html>
    <html>
    
    <head>
        <style>
            .template {
                margin: 15px;
                font-size: 17px;
                font-family: 'Courier New', Courier, monospace;
            }
    
            .template p {
                margin: 4px 0px;
            }
    
            .template .content {
                margin-top: 23px;
            }
    
            .template .content h6 {
                font-size: 23px;
                margin-bottom: 8px;
            }
    
            .template .content .btn a {
                background-color: black;
                padding: 8px 23px;
                border-radius: 10px;
                text-decoration: none;
                color: white;
            }
    
            .template .bottom {
                margin-top: 32px;
            }
    
            footer p, footer h2 {
                margin-bottom: 0px;
                margin-top: 0px;
            }
        </style>
    </head>
    
    <body>
        <div class="template">
            <h2>Order Confirmation: </h2>
            <p>Order Id: ${orderId}</p>
            <p>Thank you for your purchase!</p>
    
            <div class="content">
                <p style="margin-bottom: 23px;">Hi ${name}, 
                ${orderStatus ? `Your Order is ${orderStatus}!` : "we’re getting your order ready to be delivered!"}
                </p>    
                <div class="btn" style="margin: 43px 0px;">
                    <a href={${link}} target="_blank">View Your Order</a>
                </div>
    
                Order summary
    
                <footer>
                <div class="bottom">
                    <h2>Dêrik-online-shop</h2>
                </div>
            </footer>
            </div>
        </div>
    </body>
    
    </html>`
        ;
};

module.exports = Template;