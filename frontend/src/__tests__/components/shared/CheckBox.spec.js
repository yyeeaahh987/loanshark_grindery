import { useState } from "react";
import renderer from "react-test-renderer";
import { screen, fireEvent, render } from "@testing-library/react";
import CheckBox from "../../../components/shared/CheckBox";

const CheckBoxTest = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (value) => {
    setChecked(value);
  };

  return <CheckBox checked={checked} onChange={handleChange} />;
};

describe("CheckBox component", () => {
  test("changes the state when clicked", () => {
    const component = renderer.create(<CheckBoxTest />);
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();

    renderer.act(() => {
      tree.props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("icon alt attribute is changed when clicked", () => {
    render(<CheckBoxTest />);

    expect(screen.getByAltText(/empty checkbox icon/i)).toBeTruthy();

    fireEvent.click(screen.getByAltText(/empty checkbox icon/i));

    expect(screen.getByAltText(/filled checkbox icon/i)).toBeTruthy();
  });
});
