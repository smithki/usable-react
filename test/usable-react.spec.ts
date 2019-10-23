import { Expect, Test, TestFixture } from 'alsatian';
import './mocks/browser';

@TestFixture('`usable-react` Tests')
export class UsableReactTestFixture {
  @Test('Tests coming soon')
  public helloWorldTest() {
    Expect(true).toBeTruthy();
  }
}
