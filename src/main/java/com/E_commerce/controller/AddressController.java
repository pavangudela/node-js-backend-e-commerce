package com.E_commerce.controller;
import com.E_commerce.dto.AddressResponseAndRequest;
import com.E_commerce.modal.JwtUserAccessor;
import com.E_commerce.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
public class AddressController {
   @Autowired
   AddressService addressService;
   @Autowired
   private JwtUserAccessor jwtUser;

   @GetMapping
   public ResponseEntity<List<AddressResponseAndRequest> >getMyAddresses(){
      return addressService.getMyAddresses(jwtUser.getMail());
   }
   @GetMapping("/{Id}")
   public ResponseEntity<AddressResponseAndRequest> getAddressById(@PathVariable Long Id){
      return addressService.getAddressById(jwtUser.getMail(),Id);
   }
   @GetMapping("/default")
   public ResponseEntity<AddressResponseAndRequest> getDefaultAddress(){
      return addressService.getDefaultAddress(jwtUser.getMail());
   }


   @PostMapping("/add")
   public ResponseEntity<List<AddressResponseAndRequest>> AddAddress(@RequestBody  AddressResponseAndRequest request){
       return  addressService.addAddress(jwtUser.getMail(), request);
   }
   @PutMapping("/update/{id}")
   public ResponseEntity<List<AddressResponseAndRequest>> updateAddress(@PathVariable Long id, @RequestBody AddressResponseAndRequest request){
      request.setId(id);
       return addressService.updateAddress(jwtUser.getMail(), request);
   }
   @DeleteMapping("/delete/{addressId}")
   public ResponseEntity<List<AddressResponseAndRequest>> deleteAddress(@PathVariable Long addressId){
     return addressService.removeAddress(jwtUser.getMail(), addressId);
   }






}
