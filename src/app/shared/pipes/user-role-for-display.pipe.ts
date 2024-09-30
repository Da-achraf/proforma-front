import { Pipe, PipeTransform } from '@angular/core';
import { getUserRoleToDisplay } from '../../models/user/user.model';

@Pipe({
  name: 'userRoleForDisplay',
  pure: true
})
export class UserRoleForDisplayPipe implements PipeTransform {

  transform(role: unknown): string {
    return getUserRoleToDisplay(role)
  }

}
