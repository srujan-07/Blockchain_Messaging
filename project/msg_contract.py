from pyteal import *

def message_contract():
    sender = Txn.sender()
    receiver = Txn.application_args[0]
    message = Txn.application_args[1]

    program = Seq([
        Assert(Txn.type_enum() == TxnType.ApplicationCall),
        Assert(Len(receiver) > Int(0)),  # Ensure receiver address is valid
        Assert(Len(message) > Int(0)),  # Ensure message is not empty

        App.globalPut(receiver, message),  # Store message on blockchain
        Approve()
    ])

    return program

if __name__ == "__main__":
    print(compileTeal(message_contract(), mode=Mode.Application, version=2))
