import { Expect, Test, TestFixture } from 'alsatian';
import './mocks/browser';

@TestFixture('`usable-react` Tests')
export class UsableReactTestFixture {
  @Test('Sets default items in storage')
  public helloWorldTest() {
    Expect(true).toBeTruthy();
  }
}
