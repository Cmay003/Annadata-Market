
import { useNavigate } from "react-router-dom";
import { categoryData } from "./categoryData";
import type { Product } from "../../../types/productTypes";


interface Props {
  selectedCategory: string;
  setShowSheet?: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDrawer?: (open: boolean) => () => void;
  // item: Product;
}


const CategorySheet: React.FC<Props> = ({
  // item,
  selectedCategory,
  setShowSheet,
  toggleDrawer,
}) => {

    const navigate = useNavigate(); // ✅ ADD THIS
  // const navigate = useNavigate();

  const handleClick = (categoryId: string, item: any) => {
    if (setShowSheet) setShowSheet(false);
    if (toggleDrawer) toggleDrawer(false)();

    // navigate(`/product-details/${selectedCategory}/${item.name}/${item.id}`);
  };


  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categoryData[selectedCategory]?.map((item: any) => (
          <div
            key={item.categoryId}
             onClick={() => handleClick(item.categoryId, item)}
            className="
              px-3 
              py-2 
              rounded-md 
              hover:bg-gray-100 
              cursor-pointer 
              text-sm
              whitespace-nowrap
            "
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySheet;