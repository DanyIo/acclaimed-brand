namespace Acclaimed.Domain.Entities
{
    public abstract class Product
    {
        public int ProductID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string[] Images { get; set; }
        public decimal Price { get; set; }
        public int CategoryID { get; set; }
        public int StockQuantity { get; set; }
        public virtual Category Category { get; set; }
    }

    public class HeadHook : Product
    {
        public int Quantity { get; set; }
        public float[] Weights { get; set; }

    }

    public class FishingRod : Product
    {
        public string Length { get; set; }
        public float Weight { get; set; }
        public int MinTest { get; set; }
        public int MaxTest { get; set; }
    }

    public class Category
    {
        public int CategoryID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}
