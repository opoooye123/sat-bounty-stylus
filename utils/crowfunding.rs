#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
extern crate alloc;

use alloc::{string::String, vec::Vec};
use alloy_primitives::{Address, U256};
use alloy_sol_types::sol;
use stylus_sdk::{
    call::transfer_eth, contract, evm, msg, prelude::*
};

// Solidity-style storage definition
sol_storage! {
    #[entrypoint]
    pub struct CrowdFunding {
        address admin;
        address receiver;
        mapping(address => uint256) donors_list;
    }
}

// Solidity-style errors
sol!{
    error ZeroAddressNotAllowed();
    error NotValidAmount(uint256 amount);
    error NotInList();
}

// Define errors in Rust
#[derive(SolidityError)]
pub enum Errors {
    ZeroAddressNotAllowed(ZeroAddressNotAllowed),
    NotValidAmount(NotValidAmount),
    NotInList(NotInList),
}

#[public]
impl CrowdFunding {
    
    pub fn init(&mut self, receiver: Address) -> Result<(), Vec<u8>> {
        self.admin.set(self.vm().msg_sender());
        self.receiver.set(receiver);
        Ok(())
    }

    /// Handles donations with amount validation.
     #[payable]
    pub fn donate(&mut self) -> Result<(), Errors> {
        let donor = self.vm().msg_sender();
        let amount_to_be_donated = self.vm().msg_value();

        // Check if the donor's address is valid
        if donor.is_zero() {
            return Err(Errors::ZeroAddressNotAllowed(().into()));
        }


        
        // Check if the amount is greater than zero
        if amount_to_be_donated.is_zero() {
            return Err(Errors::NotValidAmount(NotValidAmount { amount: self.vm().msg_value() }));
        }

        
        // Record the donation
        let current = self.donors_list.get(donor);
        self.donors_list.insert(donor, current + amount_to_be_donated);

        Ok(())
    }

    /// Transfers the specified amount to the receiver.
    pub fn transfer_funds(&mut self, amount: U256) -> Result<(), Errors> {
        let receiver = self.vm().msg_sender();
    
        // Check if the receiver is in the donors list
        let donated_amount = self.donors_list.get(receiver);
        if donated_amount.is_zero() {
            return Err(Errors::NotInList(().into()));
        }
    
        // Check if the requested amount is less than or equal to the donated amount
        if amount > donated_amount {
            return Err(Errors::NotValidAmount(NotValidAmount { amount }));
        }
    
        // Deduct the amount and update the donors list
        self.donors_list.insert(receiver, donated_amount - amount);
    
        // Transfer the funds
        self.vm().transfer_eth(receiver, amount);
    
        Ok(())
    }
    
    pub fn get_donation(&self, donor: Address) -> Result<U256, Vec<u8>> {
        Ok(self.donors_list.get(donor))
    }
}