pragma solidity >0.4.99 <0.6.0;

contract Factory {
  event Deployed(address addr);
  event Deployed2(address addr, uint256 salt);

  bytes code;

  constructor(bytes memory _code) public {
    code = _code;
  }

  function deploy() public {
    address addr;
    bytes memory _code = code;
    assembly {
      addr := create(0, add(_code, 0x20), mload(_code))
      if iszero(extcodesize(addr)) {revert(0, 0)}
    }

    emit Deployed(
      addr
    );
  }

  function deploy2(uint256 _salt) public {
    address addr;
    bytes memory _code = code;
    assembly {
      addr := create2(0, add(_code, 0x20), mload(_code), _salt)
      if iszero(extcodesize(addr)) {revert(0, 0)}
    }

    emit Deployed2(
      addr,
      _salt
    );
  }
}
