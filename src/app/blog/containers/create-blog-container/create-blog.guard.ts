import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { CreateBlogContainerComponent } from "./create-blog-container.component";
import { ToastService } from "src/app/toast.service";

@Injectable()
export class CreateBlogGuard
  implements CanDeactivate<CreateBlogContainerComponent>
{
  canDeactivate(component: CreateBlogContainerComponent) {
    if (component.forDiscard) {
      if (component.form.pristine) {
        return true;
      }
      let discard = window.confirm("Discard changes and continue?")
      component.forDiscard = discard;
      return discard;
    } else if (component.form.dirty) {
      this.toastService.showMessage({
        description: "You have unsaved changes.",
        title: "Unsaved Changes",
        type: "error",
      });
    }

    return component.form.pristine;
  }

  constructor(private toastService: ToastService) {}
}
