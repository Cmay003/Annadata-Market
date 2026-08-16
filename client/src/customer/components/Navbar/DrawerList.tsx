

import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { mainCategory } from "../../../data/category/mainCategory";
import CategorySheet from "./CategorySheet";

interface Props {
  toggleDrawer: (open: boolean) => () => void;
}

const DrawerList: React.FC<Props> = ({ toggleDrawer }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  return (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem>
          <ListItemButton>
            <ListItemText
              primary={
                <h1 className="text-2xl text-[#00927c]">
                  Annadata Market
                </h1>
              }
            />
          </ListItemButton>
        </ListItem>

        <Divider />

        {mainCategory.map((item) => (
          <ListItem key={item.categoryId} disablePadding>
            <ListItemButton
              onClick={() => setSelectedCategory(item.categoryId)}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {selectedCategory && (
        <div className="p-3">
          <CategorySheet
            selectedCategory={selectedCategory}
            toggleDrawer={toggleDrawer}
          />
        </div>
      )}
    </Box>
  );
};

export default DrawerList;