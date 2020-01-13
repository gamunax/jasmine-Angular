import { TodosComponent } from './todos.component'; 
import { TodoService } from './todo.service'; 
import { Observable, of, empty, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let service: TodoService;

  beforeEach(() => {
    service = new TodoService(null);
    component = new TodosComponent(service);
  });

  it('shoul set todos property with the items returned from services', () => {
    const todos = [1, 2, 3];
    spyOn(service, 'getTodos').and.returnValue(of([todos]));
    /*spyOn(service, 'getTodos').and.callFake(() => {
      return from([ todos ]);
    });*/
    component.ngOnInit();
    expect(component.todos).toEqual([todos]);
  });

  it('should call the server to save the changes when a new todo item is added', () => {
    let spy = spyOn(service, 'add').and.callFake(t => {
      return empty();
    });

    component.add();

    expect(spy).toHaveBeenCalled();

  });

  it('should add the new todo returned from the server', () => {
    const todo = { id: 1 };
    const spy = spyOn(service, 'add').and.returnValue(from([todo]));
    /* let spy = spyOn(service, 'add').and.callFake(t => {
      return from([todo]);
    });*/

    component.add();
    expect(component.todos.indexOf(todo)).toBeGreaterThan(-1);

  });

  it('should set the message property if server returned and error when adding a new todo', () => {
    const error = 'error';
    const spy = spyOn(service, 'add').and.returnValue(throwError(error));

    /* let spy = spyOn(service, 'add').and.callFake(t => {
      return from([todo]);
    });*/

    component.add();
    expect(component.message).toBe(error);

  });

  it('should call the server to delete a todo item if the user confirms', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    let spy = spyOn(service, 'delete').and.returnValue(empty());
    component.delete(1);
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should NOT call the server to delete a todo item if the user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    let spy = spyOn(service, 'delete').and.returnValue(empty());
    component.delete(1);
    expect(spy).not.toHaveBeenCalled();
  });
});
