#!/usr/bin/env python3
"""
MusicMerchant API Backend Testing Suite
Tests all Products API endpoints and MongoDB integration
"""

import requests
import json
import uuid
import sys
from typing import Dict, Any, List

class MusicMerchantAPITester:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.api_url = f"{self.base_url}/api"
        self.test_results = []
        self.created_product_id = None
        
    def log_test(self, test_name: str, success: bool, message: str, details: Dict = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
        print()

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "MusicMerchant API" in data["message"]:
                    self.log_test("API Root", True, "API root endpoint responding correctly", 
                                {"response": data})
                else:
                    self.log_test("API Root", False, "Unexpected response format", 
                                {"response": data})
            else:
                self.log_test("API Root", False, f"HTTP {response.status_code}", 
                            {"response": response.text})
        except Exception as e:
            self.log_test("API Root", False, f"Connection error: {str(e)}")

    def test_get_all_products(self):
        """Test GET /api/products - fetch all products"""
        try:
            response = requests.get(f"{self.api_url}/products")
            if response.status_code == 200:
                products = response.json()
                if isinstance(products, list) and len(products) > 0:
                    # Verify sample data structure
                    categories = set()
                    for product in products:
                        if "category" in product:
                            categories.add(product["category"])
                    
                    expected_categories = {"sheet-music", "instruments", "accessories"}
                    if expected_categories.issubset(categories):
                        self.log_test("GET All Products", True, 
                                    f"Retrieved {len(products)} products with all categories", 
                                    {"product_count": len(products), "categories": list(categories)})
                        
                        # Test product structure for each category
                        self.verify_product_structures(products)
                    else:
                        self.log_test("GET All Products", False, 
                                    "Missing expected product categories", 
                                    {"found_categories": list(categories), 
                                     "expected": list(expected_categories)})
                else:
                    self.log_test("GET All Products", False, "No products returned or invalid format",
                                {"response": products})
            else:
                self.log_test("GET All Products", False, f"HTTP {response.status_code}",
                            {"response": response.text})
        except Exception as e:
            self.log_test("GET All Products", False, f"Request error: {str(e)}")

    def verify_product_structures(self, products: List[Dict]):
        """Verify product structures for different categories"""
        sheet_music_found = False
        instrument_found = False
        accessory_found = False
        
        for product in products:
            category = product.get("category")
            
            # Check common fields
            required_fields = ["id", "name", "description", "price", "category", "type"]
            missing_fields = [field for field in required_fields if field not in product]
            
            if missing_fields:
                self.log_test("Product Structure", False, 
                            f"Missing required fields in {category} product",
                            {"missing_fields": missing_fields, "product_id": product.get("id")})
                continue
            
            # Check category-specific fields
            if category == "sheet-music" and not sheet_music_found:
                sheet_music_fields = ["composer", "difficulty", "genre"]
                if all(field in product for field in sheet_music_fields):
                    sheet_music_found = True
                    self.log_test("Sheet Music Structure", True, 
                                "Sheet music product has all required fields",
                                {"product": product["name"], "fields": sheet_music_fields})
                else:
                    missing = [f for f in sheet_music_fields if f not in product]
                    self.log_test("Sheet Music Structure", False, 
                                "Missing sheet music specific fields",
                                {"missing": missing, "product": product["name"]})
            
            elif category == "instruments" and not instrument_found:
                instrument_fields = ["brand", "model"]
                if all(field in product for field in instrument_fields):
                    instrument_found = True
                    self.log_test("Instrument Structure", True, 
                                "Instrument product has all required fields",
                                {"product": product["name"], "fields": instrument_fields})
                else:
                    missing = [f for f in instrument_fields if f not in product]
                    self.log_test("Instrument Structure", False, 
                                "Missing instrument specific fields",
                                {"missing": missing, "product": product["name"]})
            
            elif category == "accessories" and not accessory_found:
                accessory_fields = ["brand", "model"]
                if all(field in product for field in accessory_fields):
                    accessory_found = True
                    self.log_test("Accessory Structure", True, 
                                "Accessory product has all required fields",
                                {"product": product["name"], "fields": accessory_fields})
                else:
                    missing = [f for f in accessory_fields if f not in product]
                    self.log_test("Accessory Structure", False, 
                                "Missing accessory specific fields",
                                {"missing": missing, "product": product["name"]})

    def test_create_product(self):
        """Test POST /api/products - create new product"""
        test_product = {
            "name": "Test Guitar Strings",
            "description": "High-quality steel guitar strings for acoustic guitars",
            "price": 12.99,
            "category": "accessories",
            "type": "Guitar Strings",
            "brand": "D'Addario",
            "model": "EJ16"
        }
        
        try:
            response = requests.post(f"{self.api_url}/products", 
                                   json=test_product,
                                   headers={"Content-Type": "application/json"})
            
            if response.status_code == 201:
                created_product = response.json()
                if "id" in created_product and created_product["name"] == test_product["name"]:
                    self.created_product_id = created_product["id"]
                    self.log_test("POST Create Product", True, 
                                "Product created successfully",
                                {"product_id": self.created_product_id, 
                                 "product_name": created_product["name"]})
                else:
                    self.log_test("POST Create Product", False, 
                                "Product created but response format incorrect",
                                {"response": created_product})
            else:
                self.log_test("POST Create Product", False, 
                            f"HTTP {response.status_code}",
                            {"response": response.text})
        except Exception as e:
            self.log_test("POST Create Product", False, f"Request error: {str(e)}")

    def test_update_product(self):
        """Test PUT /api/products/{id} - update product"""
        if not self.created_product_id:
            self.log_test("PUT Update Product", False, 
                        "No product ID available for update test")
            return
        
        update_data = {
            "name": "Updated Test Guitar Strings",
            "description": "Premium steel guitar strings for acoustic guitars - Updated",
            "price": 15.99,
            "category": "accessories",
            "type": "Guitar Strings",
            "brand": "D'Addario",
            "model": "EJ16-Updated"
        }
        
        try:
            response = requests.put(f"{self.api_url}/products/{self.created_product_id}",
                                  json=update_data,
                                  headers={"Content-Type": "application/json"})
            
            if response.status_code == 200:
                updated_product = response.json()
                if (updated_product["name"] == update_data["name"] and 
                    updated_product["price"] == update_data["price"]):
                    self.log_test("PUT Update Product", True, 
                                "Product updated successfully",
                                {"product_id": self.created_product_id,
                                 "updated_name": updated_product["name"],
                                 "updated_price": updated_product["price"]})
                else:
                    self.log_test("PUT Update Product", False, 
                                "Product update response incorrect",
                                {"response": updated_product})
            else:
                self.log_test("PUT Update Product", False, 
                            f"HTTP {response.status_code}",
                            {"response": response.text})
        except Exception as e:
            self.log_test("PUT Update Product", False, f"Request error: {str(e)}")

    def test_delete_product(self):
        """Test DELETE /api/products/{id} - delete product"""
        if not self.created_product_id:
            self.log_test("DELETE Product", False, 
                        "No product ID available for delete test")
            return
        
        try:
            response = requests.delete(f"{self.api_url}/products/{self.created_product_id}")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") == True:
                    self.log_test("DELETE Product", True, 
                                "Product deleted successfully",
                                {"product_id": self.created_product_id})
                    
                    # Verify product is actually deleted
                    self.verify_product_deleted()
                else:
                    self.log_test("DELETE Product", False, 
                                "Delete response format incorrect",
                                {"response": result})
            else:
                self.log_test("DELETE Product", False, 
                            f"HTTP {response.status_code}",
                            {"response": response.text})
        except Exception as e:
            self.log_test("DELETE Product", False, f"Request error: {str(e)}")

    def verify_product_deleted(self):
        """Verify that deleted product no longer exists"""
        try:
            response = requests.get(f"{self.api_url}/products")
            if response.status_code == 200:
                products = response.json()
                deleted_product_exists = any(p.get("id") == self.created_product_id for p in products)
                
                if not deleted_product_exists:
                    self.log_test("Verify Product Deleted", True, 
                                "Deleted product no longer exists in database")
                else:
                    self.log_test("Verify Product Deleted", False, 
                                "Deleted product still exists in database")
            else:
                self.log_test("Verify Product Deleted", False, 
                            "Could not verify deletion - GET products failed")
        except Exception as e:
            self.log_test("Verify Product Deleted", False, 
                        f"Error verifying deletion: {str(e)}")

    def test_invalid_routes(self):
        """Test invalid API routes"""
        invalid_routes = [
            "/api/invalid",
            "/api/products/invalid/route",
            "/api/users"
        ]
        
        for route in invalid_routes:
            try:
                response = requests.get(f"{self.base_url}{route}")
                if response.status_code == 404:
                    self.log_test(f"Invalid Route {route}", True, 
                                "Correctly returned 404 for invalid route")
                else:
                    self.log_test(f"Invalid Route {route}", False, 
                                f"Expected 404, got {response.status_code}",
                                {"response": response.text})
            except Exception as e:
                self.log_test(f"Invalid Route {route}", False, 
                            f"Request error: {str(e)}")

    def test_malformed_requests(self):
        """Test malformed requests"""
        # Test POST with invalid JSON
        try:
            response = requests.post(f"{self.api_url}/products",
                                   data="invalid json",
                                   headers={"Content-Type": "application/json"})
            
            if response.status_code >= 400:
                self.log_test("Malformed JSON", True, 
                            "Correctly handled malformed JSON request",
                            {"status_code": response.status_code})
            else:
                self.log_test("Malformed JSON", False, 
                            "Did not properly reject malformed JSON",
                            {"status_code": response.status_code})
        except Exception as e:
            self.log_test("Malformed JSON", False, f"Request error: {str(e)}")

        # Test PUT with missing product ID
        try:
            response = requests.put(f"{self.api_url}/products/nonexistent-id",
                                  json={"name": "Test"},
                                  headers={"Content-Type": "application/json"})
            
            # This should either return 404 or handle gracefully
            if response.status_code in [404, 400, 500]:
                self.log_test("Nonexistent Product Update", True, 
                            "Correctly handled update of nonexistent product",
                            {"status_code": response.status_code})
            else:
                self.log_test("Nonexistent Product Update", False, 
                            "Unexpected response for nonexistent product update",
                            {"status_code": response.status_code, "response": response.text})
        except Exception as e:
            self.log_test("Nonexistent Product Update", False, f"Request error: {str(e)}")

    def test_uuid_usage(self):
        """Test that UUIDs are being used instead of MongoDB ObjectIDs"""
        try:
            response = requests.get(f"{self.api_url}/products")
            if response.status_code == 200:
                products = response.json()
                if products:
                    sample_product = products[0]
                    product_id = sample_product.get("id")
                    
                    # Check if ID looks like a UUID (36 characters with hyphens)
                    if product_id and len(product_id) == 36 and product_id.count('-') == 4:
                        self.log_test("UUID Usage", True, 
                                    "Products are using UUIDs correctly",
                                    {"sample_id": product_id})
                    else:
                        self.log_test("UUID Usage", False, 
                                    "Products not using proper UUIDs",
                                    {"sample_id": product_id})
                else:
                    self.log_test("UUID Usage", False, "No products to check UUID format")
            else:
                self.log_test("UUID Usage", False, "Could not fetch products to check UUIDs")
        except Exception as e:
            self.log_test("UUID Usage", False, f"Error checking UUIDs: {str(e)}")

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🎵 Starting MusicMerchant API Backend Tests")
        print("=" * 50)
        print()
        
        # Test sequence
        self.test_api_root()
        self.test_get_all_products()
        self.test_uuid_usage()
        self.test_create_product()
        self.test_update_product()
        self.test_delete_product()
        self.test_invalid_routes()
        self.test_malformed_requests()
        
        # Summary
        print("=" * 50)
        print("🎵 TEST SUMMARY")
        print("=" * 50)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        print()
        
        # List failed tests
        failed_tests = [result for result in self.test_results if not result["success"]]
        if failed_tests:
            print("❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['message']}")
        else:
            print("✅ ALL TESTS PASSED!")
        
        print()
        return passed == total

def main():
    # Read base URL from environment
    try:
        with open('/app/.env', 'r') as f:
            env_content = f.read()
            for line in env_content.split('\n'):
                if line.startswith('NEXT_PUBLIC_BASE_URL='):
                    base_url = line.split('=', 1)[1].strip()
                    break
            else:
                print("❌ NEXT_PUBLIC_BASE_URL not found in .env file")
                sys.exit(1)
    except Exception as e:
        print(f"❌ Error reading .env file: {e}")
        sys.exit(1)
    
    print(f"🎵 Testing MusicMerchant API at: {base_url}")
    print()
    
    tester = MusicMerchantAPITester(base_url)
    success = tester.run_all_tests()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()