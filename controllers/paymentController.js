const { FedaPay, Transaction } = require("fedapay");
const catchAsync = require("../utils/catchAsync");

FedaPay.setApiKey(process.env.FEDA_SECRET_KEY);
FedaPay.setEnvironment("sandbox");
exports.createCheckOut = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.create({
    description: "Description",
    amount: 2000,
    callback_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/`,
    currency: {
      iso: "XOF",
    },
    customer: {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      phone_number: {
        number: "97808080",
        country: "BJ",
      },
    },
  });
  const transactonTokenObject = await transaction.generateToken();
  const token = transactonTokenObject.token;
  console.log(token);
  console.log(transaction.id);
  const rep = await Transaction.retrieve(transaction.id);
  res.status(201).json({
    status: "success",
    data: rep,
    transaction,
  });
});
