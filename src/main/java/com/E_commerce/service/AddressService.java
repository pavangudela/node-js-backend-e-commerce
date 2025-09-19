package com.E_commerce.service;

import com.E_commerce.dto.AddressResponseAndRequest;
import com.E_commerce.modal.Address;
import com.E_commerce.modal.User;
import com.E_commerce.repo.AddressRepo;
import com.E_commerce.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class AddressService {

    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private UserRepo userRepo;
public ResponseEntity<AddressResponseAndRequest> getAddressById(String userMail,  Long Id) {

    Address address = addressRepo.findById(Id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address Not Found"));
    if(!address.getUser().getEmail().equals(userMail)){
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"this Address is not yours !");
    }
    return ResponseEntity.ok().body(toResponse(address));
}

    public ResponseEntity<List< AddressResponseAndRequest>> getMyAddresses(String userMail){
        User user=userRepo.findByEmail(userMail).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));
         List<Address> myAddresses = addressRepo.findByUser(user);
       return ResponseEntity.ok().body( myAddresses.stream().map(this::toResponse).toList());

    }

@Transactional
    public ResponseEntity<List<AddressResponseAndRequest>> addAddress(String userMail,  AddressResponseAndRequest request){
        if(request.getName()==null||request.getContactNumber()==null||request.getPinCode()==null||request.getState()==null||request.getArea()==null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"fill Required fields");
        }

        System.out.println(request);
        User user =userRepo.findByEmail(userMail).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));
        Address address=new Address();
        address.setName(request.getName());
        address.setContactNumber(request.getContactNumber());
        address.setArea(request.getArea());
        address.setState(request.getState());
        address.setBuildingName(request.getBuildingName());
        address.setPinCode(request.getPinCode());
        address.setLandMark(request.getLandMark());
        address.setUser(user);
        if(request.isDefault()){
            System.out.println("hello...............................................................................");
            addressRepo.updateIsDefaultFalseForUserId(user.getId());
            address.setDefault(true);
        }else {
          long  count=  addressRepo.countByUser(user);
            if(count<1){
                address.setDefault(true);

            }
        }
        addressRepo.save(address);
    List<Address> myAddresses = addressRepo.findByUser(user);
    return ResponseEntity.ok().body(myAddresses.stream().map(this::toResponse).toList());

    }
@Transactional
    public ResponseEntity<List<AddressResponseAndRequest>> removeAddress(String userMail ,long addressId){

        User user = userRepo.findByEmail(userMail).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));
        Address address=addressRepo.getReferenceById(addressId);
        if(!address.getUser().equals(user)){
            throw  new IllegalArgumentException(" You can not remove this address Because its not yours ");
        }
        if (address.isDefault()){
            Address latest = addressRepo.findTopByUserOrderByIdDesc(user);
                if (latest != null) {
                    latest.setDefault(true);
                    addressRepo.save(latest);
                }
            }

        addressRepo.delete(address);
        List<Address> myAddresses = addressRepo.findByUser(user);
        return ResponseEntity.ok().body(myAddresses.stream().map(this::toResponse).toList());
}
    @Transactional
    public ResponseEntity<List< AddressResponseAndRequest> >updateAddress(String userMail,AddressResponseAndRequest request){

        User user= userRepo.findByEmail(userMail).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));
        Address address=addressRepo.getReferenceById(request.getId());
        if(!address.getUser().equals(user)){

            throw new IllegalArgumentException(" You can not modify this address Because its not yours");
        }
        boolean wasDefault=address.isDefault();
        address.setName(request.getName());
        address.setContactNumber(request.getContactNumber());
        address.setArea(request.getArea());
        address.setState(request.getState());
        address.setBuildingName(request.getBuildingName());
        address.setPinCode(request.getPinCode());
        address.setLandMark(request.getLandMark());
        if (request.isDefault()){
            if(!wasDefault) {
                addressRepo.updateIsDefaultFalseForUserId(user.getId());
                address.setDefault(true);
                addressRepo.save(address);
            }
        }else {

            address.setDefault(false);
            addressRepo.save(address);
            if(wasDefault){
                Address replacement = addressRepo.findTopByUserAndIdNotOrderByIdDesc(user, address.getId());
                if(replacement!=null){
                    replacement.setDefault(true);
                    addressRepo.save(replacement);
                }
            }
        }
        System.out.println(address);


        List<Address> myAddresses = addressRepo.findByUser(user);
        return ResponseEntity.ok().body(myAddresses.stream().map(this::toResponse).toList());
    }
@Transactional(readOnly = true)
public ResponseEntity<AddressResponseAndRequest> getDefaultAddress( String email){
    List<Address> addresses=addressRepo.findByUserEmail(email);
    if(addresses.isEmpty()){
        throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Address not Found");
    }

    Address defaultAddress=addresses.stream()
            .filter(Address::isDefault).findFirst()
            .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Address Not Found"));
    return  ResponseEntity.ok(toResponse(defaultAddress));
}
    public AddressResponseAndRequest toResponse(Address address){
        return new AddressResponseAndRequest(
                 address.getId(),
                address.getName(),
                address.getContactNumber(),
                address.getPinCode(),
                address.getState(),
                address.getArea(),
                address.getLandMark(),
                address.getBuildingName(),
                address.isDefault()
        );
    }


}
