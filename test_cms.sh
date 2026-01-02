#!/bin/bash

# Base URL
BASE_URL="http://localhost/api/cms"

echo "Testing CMS API..."
echo "========================================"

# 1. Get Curriculum Tree
echo "[1] GET /curriculum"
curl -s "$BASE_URL/curriculum" | head -c 500
echo -e "\n... (truncated)\n"
echo "----------------------------------------"

# 2. Get Problems for a Concept (using the ID from my verification: cpt.jjgw_e8BaX)
TEST_CPT_ID="cpt.jjgw_e8BaX"
echo "[2] GET /r1/$TEST_CPT_ID/problems"
curl -s "$BASE_URL/r1/$TEST_CPT_ID/problems" | head -c 500
echo -e "\n... (truncated)\n"
echo "========================================"
echo "Done."
