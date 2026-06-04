import { Checkbox } from '../Checkbox/Checkbox';
import type { CartItem as CartItemType } from '../../../domain/Types';
import {
  ContentRow,
  DeleteButton,
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
} from './CartItem.styles';

interface CartItemProps {
  item: CartItemType;
  isSelected: boolean;
  onToggle: (id: number) => void;
  onQuantityChange: (id: number, quantity: number) => void;
  onDelete: (id: number) => void;
}

const QUANTITY_LOWER_LIMIT = 1;
const QUANTITY_UPPER_LIMIT = 99;

export const CartItem = ({
  item,
  isSelected,
  onToggle,
  onQuantityChange,
  onDelete,
}: CartItemProps) => {
  const { cartItemId, quantity, product } = item;

  const handleDecrease = () => {
    if (quantity > QUANTITY_LOWER_LIMIT)
      onQuantityChange(cartItemId, quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < QUANTITY_UPPER_LIMIT)
      onQuantityChange(cartItemId, quantity + 1);
  };

  return (
    <ItemContainer>
      <TopRow>
        <Checkbox checked={isSelected} onChange={() => onToggle(cartItemId)} />
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
            <StepperButton onClick={handleDecrease} disabled={quantity <= 1}>
              −
            </StepperButton>
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <StepperButton onClick={handleIncrease} disabled={quantity >= 99}>
              +
            </StepperButton>
          </StepperContainer>
        </InfoSection>
      </ContentRow>
    </ItemContainer>
  );
};
