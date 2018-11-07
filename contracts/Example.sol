pragma solidity >0.4.99 <0.6.0;

contract Example {

  event OwnerChanged(address owner);

  address payable owner;

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  constructor() public {
    owner = msg.sender;
  }

  function getOwner() public view returns (address) {
    return owner;
  }

  function transferOwnership(address payable _owner) public onlyOwner {
    owner = _owner;

    emit OwnerChanged(owner);
  }

  function destroy() public onlyOwner {
    selfdestruct(owner);
  }
}
