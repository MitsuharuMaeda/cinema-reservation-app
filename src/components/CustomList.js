import styled from "styled-components";

const OrderedListContainer = styled.div`
  margin: var(--spacing-medium) 0;
`;

const ListItem = styled.div`
  display: flex;
  margin-bottom: var(--spacing-small);
`;

const NumberContainer = styled.div`
  flex: 0 0 30px;
  color: var(--text-color);
  font-weight: bold;
`;

const ContentContainer = styled.div`
  flex: 1;
`;

export const OrderedList = ({ items }) => {
  return (
    <OrderedListContainer>
      {items.map((item, index) => (
        <ListItem key={index}>
          <NumberContainer>{index + 1}.</NumberContainer>
          <ContentContainer>{item}</ContentContainer>
        </ListItem>
      ))}
    </OrderedListContainer>
  );
};

export default OrderedList;
