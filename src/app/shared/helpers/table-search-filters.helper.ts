import { DeliveryAddress } from '../../models/delivery-address.model';
import { ShipPointModel } from '../../models/ship.model';
import { TableNameEnum } from '../../models/table.model';
import { DepartmentModel } from '../../models/user/departement';
import { PlantModel } from '../../models/user/plant.model';
import { User } from '../../models/user/user.model';

export interface ISearchFilterStrategy<T> {
  filter(searchValue: string, items: T[]): T[];
}

// Strategies
export class UserSearchFilterStrategy implements ISearchFilterStrategy<User> {
  filter(searchValue: string, users: User[]): User[] {
    console;
    return users.filter((user: User) => {
      return (
        user.userName.toLowerCase().includes(searchValue) ||
        user.role.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)
      );
    });
  }
}

export class PlantSearchFilterStrategy
  implements ISearchFilterStrategy<PlantModel>
{
  filter(searchValue: string, plants: PlantModel[]): PlantModel[] {
    return plants.filter((plant: PlantModel) => {
      return (
        plant.plantNumber.toLowerCase().includes(searchValue) ||
        plant.location.toLowerCase().includes(searchValue) ||
        plant.manager_plant.toLowerCase().includes(searchValue) ||
        plant.businessUnit.toLowerCase().includes(searchValue)
      );
    });
  }
}

export class DepartmentSearchFilterStrategy
  implements ISearchFilterStrategy<DepartmentModel>
{
  filter(
    searchValue: string,
    departements: DepartmentModel[]
  ): DepartmentModel[] {
    return departements.filter((departement: DepartmentModel) => {
      return (
        departement.name.toLowerCase().includes(searchValue) ||
        departement.manager.toLowerCase().includes(searchValue)
      );
    });
  }
}

export class ShipPointSearchFilterStrategy
  implements ISearchFilterStrategy<ShipPointModel>
{
  filter(searchValue: string, shipPoints: ShipPointModel[]): ShipPointModel[] {
    return shipPoints.filter((shipPoint: ShipPointModel) => {
      return (
        shipPoint.shipPoint.toLowerCase().includes(searchValue) ||
        shipPoint.fullAddress.toLowerCase().includes(searchValue)
      );
    });
  }
}

export class DeliveryAddressSearchFilterStrategy
  implements ISearchFilterStrategy<DeliveryAddress>
{
  filter(
    searchValue: string,
    deliveryAddresses: DeliveryAddress[]
  ): DeliveryAddress[] {
    return deliveryAddresses.filter((address: DeliveryAddress) => {
      return (
        address.customerId?.toLowerCase().includes(searchValue) ||
        address.companyName?.toLowerCase().includes(searchValue) ||
        address.country?.toLowerCase().includes(searchValue) ||
        address.street?.toLowerCase().includes(searchValue) ||
        address.vat?.toLowerCase().includes(searchValue) ||
        address.zipCode?.toLowerCase().includes(searchValue)
      );
    });
  }
}

type StrategyMap = {
  [TableNameEnum.USER]: ISearchFilterStrategy<User>;
  [TableNameEnum.PLANT]: ISearchFilterStrategy<PlantModel>;
  [TableNameEnum.DEPARTMENT]: ISearchFilterStrategy<DepartmentModel>;
  [TableNameEnum.SHIP_POINT]: ISearchFilterStrategy<ShipPointModel>;
  [TableNameEnum.DELIVERY_ADDRESS]: ISearchFilterStrategy<DeliveryAddress>;
};

export const searchFilterStrategyFactory = (
  tableName: TableNameEnum
): StrategyMap[TableNameEnum] => {
  switch (tableName) {
    case TableNameEnum.USER:
      return new UserSearchFilterStrategy();
    case TableNameEnum.PLANT:
      return new PlantSearchFilterStrategy();
    case TableNameEnum.DEPARTMENT:
      return new DepartmentSearchFilterStrategy();
    case TableNameEnum.SHIP_POINT:
      return new ShipPointSearchFilterStrategy();
    case TableNameEnum.DELIVERY_ADDRESS:
        return new DeliveryAddressSearchFilterStrategy();
  }
};
