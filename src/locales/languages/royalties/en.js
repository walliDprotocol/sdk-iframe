export default {
  idtName: {
    UC_CMD_PT: "CHAVE MÓVEL DIGITAL",
  },
  idtIdentifier: {
    UC_CMD_PT: "Phone number: {mobileNumber} ",
  },
  welcome: {
    title: "Welcome to WalliD Qualified Signature",
    text1:
      "This document requires a Qualified Electronic Signature that can be achieved with AMA's Chave Móvel Digital (CMD).",
    text2:
      "In the next steps you will be able to authenticate with your CMD and sign the document with its' certificate, ensuring a qualified and legally binding signature.",
    text3: [
      "If you haven't stored your ID document in your wallet yet, please do it on",
      " WalliD's website",
      "and come back to this page to resume your signature.",
    ],
    terms: [
      "Please accept",
      "AMA CMD's terms and conditions",
      "and",
      "Wallid's terms and conditions",
    ],
  },
  textNoCMD: ["Don't have your signature PIN active yet?", "Activate it on autenticação.gov"],
  identity: {
    title: "Sign this document with your Chave Móvel Digital",
    text: "Please provide the phone number and password (PIN) associated to your CMD. You'll receive an SMS or a notification from Autenticação.gov APP with the verification code to complete the signature.",
    numberLabel: ["Mobile number:", "Enter your mobile number"],
    placeholder: "Select a valid identity",
    pinLabel: ["PIN:", "Enter your pin"],
  },
  authentication: {
    title: "Authentication validation",
    text: "Please provide the code sent to you by SMS or via Autenticação.Gov APP within the next 5 minutes and complete the signature.",
    textStored:
      "Please provide the code sent to your phone by AMA's CMD within the next 5 minutes and complete the signature with your CMD already stored in your MyWalliD wallet.",

    codeLabel: ["Authentication code:", "Enter the code"],
  },
  successfull: {
    title: "Your document has been successfully signed!",
    text1: [
      " The envelope ID",
      "with the documents: ",
      "has been successfully signed.",
      "CMD's qualified signature has been embedded in the document and can now be verified.",
    ],
    cmdStoreText: [
      "Do you want to save your CMD data for next time?",
      "Store it in MyWalliD wallet ",
      "browser extension and sign your documents instantly.",
    ],
    cmdStoreBtn: "Store CMD in MyWalliD",
  },
  errors: {
    noCMD:
      "Your mobile number doesn't have an active CMD associated or your signature PIN isn't active",
    incorrectPIN: "Your PIN is not correct",
    numberRequired: "Your mobile number is required",
    pinRequired: "Your PIN is required",
    incorrectCode: "Your authentication code is not correct",
    codeRequired: "An authentication code is required",
    expired:
      "Your session has expired. Please go back to your email and start the signature process again.",
    failedsignature: ["It was not possible to sign this document. Please ", " contact us."],
    notPDF:
      " is not PDF! It's not possible to provide a qualified signature on documents in this format. Please contact the sender.",
    alreadySigned:
      "All documents within this envelope have already been signed. Please refresh the page.",

    expiredOtp:
      "Authentication code expired. Please go back to the previous step and repeat the process.",
  },
  button: {
    next: "Next",
    back: "Back",
    authenticate: "Authenticate",
    sign: "Sign document",
    done: "Done",
  },
};
