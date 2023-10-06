import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "delete-confirmation",
  templateUrl: "./delete-confirmation.component.html",
  styleUrls: ["./delete-confirmation.component.scss"],
})
export class DeleteConfirmationComponent {
  @Input() modalId: string;

  @Output() confirm: EventEmitter<void> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();
}
