import { Pipe, PipeTransform } from '@angular/core';
import { DeliveryAddress } from '../../core/models/delivery-address.model';

@Pipe({
  name: 'deliveryaddress',
})
export class DeliveryAddressPipe implements PipeTransform {
  transform(address: DeliveryAddress | undefined) {
    if (!address) return '------------';

    if (address.fullAddress) return address.fullAddress;

    const { companyName, street, zipCode, country } = address;
    const addressParts = [companyName, street, zipCode, country].filter(
      (part) => part !== undefined
    );
    return addressParts.join(', ');
  }
}
