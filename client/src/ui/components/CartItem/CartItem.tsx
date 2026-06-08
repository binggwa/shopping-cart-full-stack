import { Checkbox } from "../Checkbox/Checkbox";
import type { CartItem as CartItemType } from "../../../domain/Types";
import {
  ContentRow,
  DeleteButton,
  Divider,
  InfoSection,
  ItemContainer,
  ProductName,
  ProductPrice,
  QuantityDisplay,
  StepperButton,
  StepperContainer,
  TextGroup,
  Thumbnail,
  TopRow,
} from "./CartItem.styles";
import { CART_RULES } from "../../../domain/constants";

interface CartItemProps {
  item: CartItemType;
  isSelected: boolean;
  onSelectionChange: (id: number, isChecked: boolean) => void;
  onQuantityChange: (id: number, quantity: number) => void;
  onDelete: (id: number) => void;
}

export const CartItem = ({
  item,
  isSelected,
  onSelectionChange,
  onQuantityChange,
  onDelete,
}: CartItemProps) => {
  const { cartItemId, quantity, product } = item;

  const handleDecrease = () => {
    if (quantity > CART_RULES.MIN_QUANTITY)
      onQuantityChange(cartItemId, quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < CART_RULES.MAX_QUANTITY)
      onQuantityChange(cartItemId, quantity + 1);
  };

  return (
    <ItemContainer>
      <Divider />

      <TopRow>
        <Checkbox checked={isSelected} onChange={(isChecked) => onSelectionChange(cartItemId, isChecked)} />
        <DeleteButton onClick={() => onDelete(cartItemId)}>삭제</DeleteButton>
      </TopRow>

      <ContentRow>
        <Thumbnail src={product.thumbnailUrl} alt={product.name} />

        <InfoSection>
          <TextGroup>
            <ProductName>{product.name}</ProductName>
            <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
          </TextGroup>

          <StepperContainer>
            <StepperButton
              onClick={handleDecrease}
              disabled={quantity <= CART_RULES.MIN_QUANTITY}
            >
              −
            </StepperButton>
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <StepperButton
              onClick={handleIncrease}
              disabled={quantity >= CART_RULES.MAX_QUANTITY}
            >
              +
            </StepperButton>
          </StepperContainer>
        </InfoSection>
      </ContentRow>
    </ItemContainer>
  );
};
